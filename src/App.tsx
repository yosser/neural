import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, ArcElement, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut, Scatter } from 'react-chartjs-2';
import { useTimeout } from './hooks/hooks';
import { NeuralNetwork } from './libs/neuralNetwork';

import './App.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend);

const NEW_EPOCH_TIMEOUT = 10;
const MAX_EPOCHS = 500;
const LOOPS_IN_EPOCH = 100;

const BACKGROUND_COLOURS = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(255, 206, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(255, 159, 64, 0.2)',
];

const BORDER_COLOURS = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
];

function App() {
  const [epochs, setEpochs] = useState(0);
  const [delay, setDelay] = useState<number | null>(null);
  const [update, setUpdate] = useState('');

  const [weightsIn, setWeightsIn] = useState<number[][]>([]);
  const [weightsOut, setWeightsOut] = useState<number[][]>([]);
  const [accuracy, setAccuracy] = useState<number[]>([]);

  const [neuralNetwork, setNeuralNetwork] = useState<NeuralNetwork>();

  const inputNodes = 2;
  const hiddenNodes = 16;
  const outputNodes = 1;
  const learningRate = 0.1;
  /*
    const trainingData = useMemo(() => [
      { input: [0, 0], target: [0] },
      { input: [0, 1], target: [1] },
      { input: [1, 0], target: [1] },
      { input: [1, 1], target: [0] },
    ], []);
  
  */

  function generateSpiralData(numSamples: number, noise: number): { input: number[]; target: number[] }[] {
    const data: { input: number[]; target: number[] }[] = [];

    for (let i = 0; i < numSamples / 2; i++) {
      const r = (i / numSamples) * 5;
      const t = (1.75 * i) / numSamples * 2 * Math.PI + Math.random() * noise;

      // Spiral 1 (class 0)
      data.push({
        input: [r * Math.sin(t), r * Math.cos(t)],
        target: [0],
      });

      // Spiral 2 (class 1)
      data.push({
        input: [r * Math.sin(t + Math.PI), r * Math.cos(t + Math.PI)],
        target: [1],
      });
    }

    return data;
  }

  const trainingData = useMemo(() => generateSpiralData(1000, 0.1), []);


  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  //const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const barData = {
    labels: accuracy.map((_, idx) => `Epoch ${idx}`),
    datasets: [
      {
        label: 'Accuracy',
        data: accuracy,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };


  const scatterOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const scatterData = {
    datasets: [
      {
        label: 'A dataset',
        data: [{ x:, y:}],
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  useEffect(() => {
    setEpochs(0);
    setNeuralNetwork(new NeuralNetwork(inputNodes, hiddenNodes, outputNodes, learningRate))
  }, []);

  // Train the neural network
  useTimeout(() => {
    setDelay(null);

    for (let i = 0; i < LOOPS_IN_EPOCH; i++) {
      //     if (i % 1000 === 0) console.log(`Epoch: ${i}`);
      trainingData.forEach(data => {
        if (neuralNetwork) {
          neuralNetwork.train(data.input, data.target);
        }
      });
    }

    // Test the neural network
    setEpochs(epochs + 1);
  }, delay);

  useEffect(() => {
    if (!neuralNetwork) return;
    const updates: string[] = [];
    let error = 0;
    trainingData.forEach(data => {
      const output = neuralNetwork.predict(data.input);
      //console.log(`Input: [${data.input}] | Target: [${data.target}] | Prediction: [${output.map(Math.round)}]`);
      updates.push(`Input: [${data.input}] | Target: [${data.target[0]}] | Prediction: [${output[0]}]`);
      error += Math.abs(data.target.reduce((acc, v, i) => acc + Math.abs(v - output[i]), 0));
    })
    const w = neuralNetwork.getWeightsInput();
    let w1 = neuralNetwork.getWeightsOutput();
    setAccuracy([...accuracy, error]);
    if (w1[0].length === 1) {
      w1 = [w1.map(v => v[0])];
    }
    setWeightsIn(w);
    setWeightsOut(w1);
    setUpdate([...updates, `Error: ${error}`, `Weights in ${JSON.stringify(w)}`, `Weights out ${JSON.stringify(w1)}`].join('\n'));
    if (epochs < MAX_EPOCHS) {
      setDelay(NEW_EPOCH_TIMEOUT);
    }
  }, [epochs, neuralNetwork, trainingData]);


  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets:
      [...weightsIn.map((w, idx) =>
      ({
        label: `Weights in ${idx}`,
        data: w,
        backgroundColor: BACKGROUND_COLOURS,
        borderColor: BORDER_COLOURS,
        borderWidth: 1,
      })), ...weightsOut.map((w, idx) => ({
        label: `Weights out ${idx}`,
        data: w,
        backgroundColor: BACKGROUND_COLOURS,
        borderColor: BORDER_COLOURS,
        borderWidth: 1
      }))]
    ,
  };

  return (
    <div className="App">
      Number of epochs {epochs}
      <pre>{update}</pre>

      <div style={{ maxWidth: '500px', maxHeight: '500px' }}>
        <Doughnut data={data} />
      </div>
      <div style={{ maxWidth: '500px', maxHeight: '500px' }}>
        <Scatter options={scatterOptions} data={scatterData} />
      </div>
      <div style={{ maxWidth: '500px', maxHeight: '500px' }}>
        <Bar options={barOptions} data={barData} />
      </div>
    </div>
  );
}

export default App;
