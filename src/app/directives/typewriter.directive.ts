import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[typewriter]',
  standalone: true
})
export class TypewriterDirective implements OnInit {
  @Input('typewriter') text = '';
  @Input() speed = 50;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    if (!this.text) return;

    this.el.nativeElement.textContent = '';
    let currentChar = 0;

    const type = () => {
      if (currentChar < this.text.length) {
        this.el.nativeElement.textContent += this.text.charAt(currentChar);
        currentChar++;
        setTimeout(type, this.speed);
      }
    };

    type();
  }

}
