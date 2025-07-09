import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // necesario para [(ngModel)]

export interface Subsection {
  id: string;
  title: string;
  fecha?: string;
  modificado?: string;
}

export interface Section {
  id: string;
  title: string;
  fecha?: string;
  modificado?: string;
  subsections?: Subsection[];
}

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  @Input() sections: Section[] = [];
  @Output() sectionSelected = new EventEmitter<string>();

  searchTerm = '';

  scrollTo(sectionId: string): void {
    this.sectionSelected.emit(sectionId);
  }

  getFilteredSections(): Section[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.sections;

    return this.sections
      .map((section): Section | null => {
        const sectionMatch = section.title.toLowerCase().includes(term);
        const matchedSubsections = (section.subsections || []).filter(sub =>
          sub.title.toLowerCase().includes(term)
        );

        if (sectionMatch || matchedSubsections.length > 0) {
          return {
            ...section,
            subsections: matchedSubsections
          };
        }

        return null;
      })
      .filter((section): section is Section => section !== null);
  }
}
