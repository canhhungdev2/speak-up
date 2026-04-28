import { Component, ElementRef, ViewChild, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ],
  template: `
    <div 
      #editor
      contenteditable="true"
      (input)="onInput()"
      (blur)="onBlur()"
      (keydown)="onKeyDown($event)"
      class="w-full bg-white dark:bg-white/5 border-none rounded-xl p-4 text-sm font-medium leading-relaxed focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px] prose prose-sm dark:prose-invert max-w-none"
      [attr.placeholder]="placeholder"
    ></div>
  `,
  styles: [`
    [contenteditable]:empty:before {
      content: attr(placeholder);
      color: #94a3b8;
      cursor: text;
    }
    .dark [contenteditable]:empty:before {
      color: #475569;
    }
    :host { display: block; }
    b, strong { font-weight: 900; color: var(--primary-color, #6366f1); }
    i, em { font-style: italic; opacity: 0.8; }
  `]
})
export class RichTextEditorComponent implements ControlValueAccessor {
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;
  @Input() placeholder: string = '';

  private onChange: any = () => {};
  private onTouched: any = () => {};
  private value: string = '';

  writeValue(value: any): void {
    this.value = value || '';
    if (this.editor) {
      this.editor.nativeElement.innerHTML = this.value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(): void {
    const html = this.editor.nativeElement.innerHTML;
    this.onChange(html);
  }

  onBlur(): void {
    this.onTouched();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'b') {
        event.preventDefault();
        document.execCommand('bold', false);
      } else if (event.key === 'i') {
        event.preventDefault();
        document.execCommand('italic', false);
      }
    }
  }

  // Helper method for external buttons
  execCommand(command: string) {
    this.editor.nativeElement.focus();
    document.execCommand(command, false);
    this.onInput();
  }
}
