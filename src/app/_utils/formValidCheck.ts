import { FormArray, FormGroup } from '@angular/forms';

export function markInvalidFields(form: FormGroup) {
  if (!form) {
    return;
  }
  Object.keys(form.controls).map((control) => {
    const element = form.get(control);
    if (element?.invalid) {
      if (element instanceof FormArray) {
        element.controls.map((arrayControl) => markInvalidFields(arrayControl as FormGroup));
      }
      element?.markAsDirty();
    }
  });
}

export function isFormInvalid(form: FormGroup): boolean {
  if (form?.invalid) {
    markInvalidFields(form);
    return true;
  }
  return false;
}
