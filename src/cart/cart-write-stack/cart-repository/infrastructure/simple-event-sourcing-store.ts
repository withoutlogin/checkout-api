import { ESEvent, IEventSourcingStore } from 'common/event-sourcing';

export class SimpleEventSourcingStore implements IEventSourcingStore {
  private storage = new Map<string, ESEvent[]>();
  constructor(events: ESEvent[] = []) {
    events.forEach((ev) => this.addEvent(ev));
  }

  async addEvent(event: ESEvent): Promise<void> {
    const objectKey = SimpleEventSourcingStore.generateKey(
      event.getSubjectName(),
      event.getSubjectIdentifier(),
    );
    const list = this.storage.get(objectKey) || [];
    list.push(event);
    this.storage.set(objectKey, list);
  }

  async getEventsFor(
    subjectName: string,
    subjectIdentifier: string,
  ): Promise<ESEvent[]> {
    return (
      this.storage.get(
        SimpleEventSourcingStore.generateKey(subjectName, subjectIdentifier),
      ) || []
    );
  }

  static generateKey(subjectName: string, subjectIdentifier: string): any {
    return `${subjectName}-${subjectIdentifier}`;
  }
}
