import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../../services/registration.service';
import { UserRegistration } from '../../models/user-registration.model';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  registrationForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService
  ) {
    this.registrationForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      eta: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      codiceFiscale: ['', [Validators.required, Validators.pattern(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)]],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = false;

      const userData: UserRegistration = this.registrationForm.value;

      this.registrationService.registerUser(userData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.registrationForm.reset();
          setTimeout(() => this.submitSuccess = false, 5000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.submitError = true;
          this.errorMessage = 'Errore durante la registrazione. Riprova più tardi.';
          console.error('Errore registrazione:', error);
          setTimeout(() => this.submitError = false, 5000);
        }
      });
    } else {
      // Marca tutti i campi come touched per mostrare gli errori
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  // Helper per mostrare errori nei template
  getErrorMessage(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'Questo campo è obbligatorio';
    }
    if (control?.hasError('email')) {
      return 'Inserisci un\'email valida';
    }
    if (control?.hasError('pattern')) {
      if (fieldName === 'codiceFiscale') {
        return 'Codice fiscale non valido (16 caratteri)';
      }
      if (fieldName === 'telefono') {
        return 'Numero di telefono non valido';
      }
    }
    if (control?.hasError('min')) {
      return 'Devi avere almeno 18 anni';
    }
    if (control?.hasError('minLength')) {
      return 'Troppo corto';
    }
    return '';
  }
}