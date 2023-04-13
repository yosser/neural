import React, { useEffect, useState } from 'react';
import { BarElement, Chart, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTimeout } from './hooks/hooks';
import { NeuralNetwork } from './libs/neuralNetwork';

import './App.css';


const NEW_EPOCH_TIMEOUT = 10;
const MAX_EPOCHS = 500;
const LOOPS_IN_EPOCH = 100;

function App() {
  const [epochs, setEpochs] = useState(0);
  const [delay, setDelay] = useState<number | null>(null);
  const [update, setUpdate] = useState('');
  const [neuralNetwork, setNeuralNetwork] = useState<NeuralNetwork>();
  const inputNodes = 2;
  const hiddenNodes = 4;
  const outputNodes = 1;
  const learningRate = 0.1;

  const trainingData = [
    { input: [0, 0], target: [0] },
    { input: [0, 1], target: [1] },
    { input: [1, 0], target: [1] },
    { input: [1, 1], target: [0] },
  ];

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
      console.log(`Input: [${data.input}] | Target: [${data.target}] | Prediction: [${output.map(Math.round)}]`);
      updates.push(`Input: [${data.input}] | Target: [${data.target[0]}] | Prediction: [${output[0]}]`);
      error += Math.abs(data.target[0] - output[0]);
    })
    setUpdate([...updates, `Error: ${error}`].join('\n'));
    if (epochs < MAX_EPOCHS) {
      setDelay(NEW_EPOCH_TIMEOUT);
    }
  }, [epochs, neuralNetwork]);

  return (
    <div className="App">
      Number of epochs {epochs}
      <pre>{update}</pre>

    </div>
  );
}

export default App;
