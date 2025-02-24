import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GestionSoldeService {
  constructor() {}

  // Récupérer le solde mensuel depuis le localStorage
  getSoldeMensuel(): number {
    const savedSolde = localStorage.getItem('soldeMensuel');
    return savedSolde ? parseFloat(savedSolde) : 0;
  }

  // Modifier le solde mensuel dans le localStorage
  setSoldeMensuel(solde: number): void {
    localStorage.setItem('soldeMensuel', solde.toString());
  }

  // Récupérer les dépenses depuis le localStorage
  getDepenses(): any[] {
    const savedDepenses = localStorage.getItem('depenses');
    return savedDepenses ? JSON.parse(savedDepenses) : [];
  }

  // Ajouter une dépense dans le localStorage
  setDepenses(depenses: any[]): void {
    localStorage.setItem('depenses', JSON.stringify(depenses));
  }

  // Réinitialiser le solde et les dépenses
  reinitialiserSolde(): void {
    localStorage.removeItem('soldeMensuel');
    localStorage.removeItem('depenses');
  }
}