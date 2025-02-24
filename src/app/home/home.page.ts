import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit {
  montantDepense: number = 0;
  descriptionDepense: string = '';
  depenses: { montant: number; description: string; date: string; time: string }[] = [];
  soldeRestant: number = 0;

  @ViewChild('projectionChart') projectionChartRef!: ElementRef;
  projectionChart: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.calculerSoldeRestant(); // Calculer le solde au démarrage
    this.chargerDepenses(); // Charger les dépenses au démarrage
  }

  ngAfterViewInit() {
    this.createProjectionChart();
    this.loadSolde(); // Charger le solde au démarrage
  }

  // Charger le solde depuis le localStorage
  loadSolde() {
    this.soldeRestant = this.getSoldeMensuel();
  }

  // Formater l'heure
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Ajouter une dépense
  ajouterDepense() {
    if (this.montantDepense > 0 && this.descriptionDepense.trim() !== '') {
      const date = new Date(); // Date actuelle
      const dateString = date.toLocaleDateString(); // Date actuelle sous forme de chaîne
      const timeString = this.formatTime(date); // Heure actuelle

      this.depenses.push({
        montant: this.montantDepense,
        description: this.descriptionDepense || 'Dépense sans description',
        date: dateString,
        time: timeString, // Ajout de l'heure
      });

      this.calculerSoldeRestant();
      this.sauvegarderDepenses();
      this.updateProjectionChart(); // Mettre à jour le graphique en temps réel
      this.montantDepense = 0;
      this.descriptionDepense = '';
    } else {
      alert('Veuillez entrer un montant valide et une description.');
    }
  }

  // Calculer le solde restant
  calculerSoldeRestant() {
    const totalDepenses = this.depenses.reduce((total, depense) => total + depense.montant, 0);
    this.soldeRestant = this.getSoldeMensuel() - totalDepenses;
  }

  // Créer le graphique de projection
  createProjectionChart() {
    const ctx = this.projectionChartRef.nativeElement.getContext('2d');
    this.projectionChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [], // Jours ou mois
        datasets: [
          {
            label: 'Solde restant (fcfa)',
            data: [],
            borderColor: '#3880ff',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Jours/Mois',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Solde (fcfa)',
            },
          },
        },
      },
    });
  }

  // Mettre à jour le graphique de projection
  updateProjectionChart() {
    const soldeInitial = this.getSoldeMensuel();
    const totalDepenses = this.depenses.reduce((total, depense) => total + depense.montant, 0);
    const depenseMoyenneParJour = this.depenses.length > 0 ? totalDepenses / this.depenses.length : 0;

    // Éviter les divisions par zéro ou les valeurs infinies
    if (depenseMoyenneParJour === 0 || !isFinite(depenseMoyenneParJour)) {
      return;
    }

    // Calculer le nombre de jours avant que le solde atteigne zéro
    let joursAvantSoldeZero = Math.floor((soldeInitial - totalDepenses) / depenseMoyenneParJour);
    const joursMax = 30;
    joursAvantSoldeZero = Math.min(joursAvantSoldeZero, joursMax);

    // Générer les labels et les données
    const labels = Array.from({ length: joursAvantSoldeZero + 1 }, (_, i) => `Jour ${i + 1}`);
    const data = labels.map((_, i) => {
      return Math.max(soldeInitial - totalDepenses - depenseMoyenneParJour * (i + 1), 0);
    });

    // Mettre à jour le graphique
    this.projectionChart.data.labels = labels;
    this.projectionChart.data.datasets[0].data = data;
    this.projectionChart.update();
  }

  // Récupérer le solde mensuel depuis le localStorage
  getSoldeMensuel(): number {
    return parseFloat(localStorage.getItem('soldeMensuel') || '0');
  }

  // Méthode pour actualiser le solde
  actualiserSolde() {
    this.calculerSoldeRestant(); // Recalculer le solde restant
    this.updateProjectionChart(); // Mettre à jour le graphique
  }

  // Naviguer vers la page Details
  navigateToDetails() {
    this.router.navigate(['/details']);
  }

  // Naviguer vers la page Presentation
  navigateToPresentation() {
    this.router.navigate(['/presentation']);
  }

  // Sauvegarder les dépenses dans le localStorage
  sauvegarderDepenses() {
    localStorage.setItem('depenses', JSON.stringify(this.depenses));
  }

  // Charger les dépenses depuis le localStorage
  chargerDepenses() {
    const depensesStockees = localStorage.getItem('depenses');
    if (depensesStockees) {
      this.depenses = JSON.parse(depensesStockees);
    }
  }

  // Méthode pour réinitialiser le solde et les dépenses
  reinitialiserSolde() {
    localStorage.removeItem('soldeMensuel');
    localStorage.removeItem('depenses');

    // Réinitialiser les variables locales
    this.soldeRestant = 0;
    this.depenses = [];

    // Mettre à jour l'affichage
    this.loadSolde();
    this.updateProjectionChart();

    alert('Le solde et les dépenses ont été réinitialisés.');
  }

  // Actualiser les données
  refreshData() {
    this.loadSolde(); // Recharger le solde
    this.updateProjectionChart(); // Mettre à jour le graphique
    console.log('Données actualisées');
  }
}