export abstract class ESEvent {
  getEventName(): string {
    return this.constructor.name;
  }
  abstract getSubjectName(): string;
  abstract getSubjectIdentifier(): string;
}

export interface IEventSourcingStore {
  addEvent(event: ESEvent): Promise<void>;
  getEventsFor(
    subjectName: string,
    subjectIdentifier: string,
  ): Promise<ESEvent[]>;
}
