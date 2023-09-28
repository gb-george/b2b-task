import { BehaviorSubject, Subscription, map, timer } from 'rxjs';
import { DataElement } from './models/data.model';

const intervalSubject = new BehaviorSubject<Subscription | null>(null);

addEventListener('message', (event) => {
  const { action, options } = event.data;
  if (action === 'fetchData') {
    if (!options.dataSize) {
      postMessage([]);
      return;
    }

    const previousSubscription = intervalSubject.getValue();
    if (previousSubscription) {
      previousSubscription.unsubscribe();
    }

    const newSubscription = timer(0, options.interval)
      .pipe(map(() => generateRandomDataArray(options.dataSize)))
      .subscribe((data) => postMessage(data));

    intervalSubject.next(newSubscription);
  }
});

function generateRandomDataArray(size: number): DataElement[] {
  const randomData: DataElement[] = [];
  for (let i = 1; i <= size; i++) {
    randomData.push({
      id: `${i}`,
      int: getRandomInt(),
      float: getRandomFloat(),
      color: getRandomHexColor(),
      child: {
        id: getRandomInt(),
        color: getRandomHexColor(),
      },
    });
  }
  return randomData;
}

const getRandomInt = (): number => Math.floor(Math.random() * 100000);

const getRandomFloat = (): number =>
  parseFloat((Math.random() * 100).toFixed(18));

function getRandomHexColor(): string {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  const redHex = red.toString(16).padStart(2, '0');
  const greenHex = green.toString(16).padStart(2, '0');
  const blueHex = blue.toString(16).padStart(2, '0');

  const hexColor = `#${redHex}${greenHex}${blueHex}`;

  return hexColor;
}
