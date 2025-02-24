import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { GestionSoldeService } from '../services/gestion-solde.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false,
})
export class DetailsPage {
  nouveauSolde: number = 0; // Pour modifier le solde principal
  montantAAjouter: number = 0; // Pour ajouter un montant à part
  depenses: number[] = []; // Tableau pour stocker les dépenses

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private gestionSoldeService: GestionSoldeService
  ) {
    const savedSolde = localStorage.getItem('soldeMensuel');
    if (savedSolde) {
      this.nouveauSolde = parseFloat(savedSolde);
    }

    const savedDepenses = localStorage.getItem('depenses');
    if (savedDepenses) {
      this.depenses = JSON.parse(savedDepenses);
    }
  }

  // Modifier le solde principal
  modifierSolde() {
    if (this.nouveauSolde >= 0) {
      this.gestionSoldeService.setSoldeMensuel(this.nouveauSolde); // Mettre à jour via le service
      this.router.navigate(['/home']);
    } else {
      alert('Le solde ne peut pas être négatif.');
    }
  }

  // Ajouter un montant au solde principal
  ajouterAuSolde() {
    if (this.montantAAjouter > 0) {
      const soldeActuel = this.gestionSoldeService.getSoldeMensuel(); // Récupérer le solde via le service
      const nouveauSolde = soldeActuel + this.montantAAjouter;
      this.gestionSoldeService.setSoldeMensuel(nouveauSolde); // Mettre à jour via le service
      this.router.navigate(['/home']);
    } else {
      alert('Le montant à ajouter doit être positif.');
    }
  }

  // Méthode pour récupérer les dépenses depuis le localStorage
  getDepenses(): number[] {
    const savedDepenses = localStorage.getItem('depenses');
    return savedDepenses ? JSON.parse(savedDepenses) : [];
  }

  // Ajouter une dépense au solde
  ajouterDepense() {
    if (this.montantAAjouter > 0) {
      const soldeActuel = this.gestionSoldeService.getSoldeMensuel(); // Récupérer le solde via le service

      // Vérifier que le solde est suffisant pour cette dépense
      if (soldeActuel >= this.montantAAjouter) {
        const nouveauSolde = soldeActuel - this.montantAAjouter;
        this.depenses.push(this.montantAAjouter);
        localStorage.setItem('depenses', JSON.stringify(this.depenses));
        this.gestionSoldeService.setSoldeMensuel(nouveauSolde); // Mettre à jour via le service
        this.montantAAjouter = 0; // Réinitialiser le champ de saisie

        // Recharger les dépenses pour mise à jour de l'affichage
        this.depenses = this.getDepenses();
        this.cdr.detectChanges();

        this.router.navigate(['/home']);
      } else {
        alert('Le solde est insuffisant pour cette dépense.');
      }
    } else {
      alert('Le montant doit être positif.');
    }
  }

  // Récupérer le solde mensuel depuis le localStorage
  getSoldeMensuel(): number {
    return this.gestionSoldeService.getSoldeMensuel(); // Utiliser le service
  }
}