import React from 'react';
import { BarElement, Chart, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTimeout } from './hooks/hooks';
import { NeuralNetwork } from './libs/neuralNetwork';

import './App.css';


const NEW_EPOCH_TIMEOUT = 1000;

function App() {
  const [epochs, setEpochs] = React.useState(0);
  const [delay, setDelay] = React.useState(0);

  const inputNodes = 2;
  const hiddenNodes = 4;
  const outputNodes = 1;
  const learningRate = 0.1;

  const neuralNetwork = new NeuralNetwork(inputNodes, hiddenNodes, outputNodes, learningRate);

  const trainingData = [
    { input: [0, 0], target: [0] },
    { input: [0, 1], target: [1] },
    { input: [1, 0], target: [1] },
    { input: [1, 1], target: [0] },
  ];

  // Train the neural network
useTimeout(() => {
  const epochs = 1000;
  for (let i = 0; i < epochs; i++) {
    if (i % 1000 === 0) console.log(`Epoch: ${i}`);
    trainingData.forEach(data => {
      neuralNetwork.train(data.input, data.target);
    });
  }


}, delay);


  useEffect(() => {

  },[])

  const epochs = 1000;
  for (let i = 0; i < epochs; i++) {
    if (i % 1000 === 0) console.log(`Epoch: ${i}`);
    trainingData.forEach(data => {
      neuralNetwork.train(data.input, data.target);
    });
  }

  // Test the neural network
  trainingData.forEach(data => {
    const output = neuralNetwork.predict(data.input);
    console.log(JSON.stringify(output));
    console.log(`Input: [${data.input}] | Target: [${data.target}] | Prediction: [${output.map(Math.round)}]`);
  });


  return (
    <div className="App">
      Hello mum
     <Bar
                            options={{
                                animation: { duration: 250, delay: 0 },
                            }}
                            data={mangledData(chart)}
                        />
    </div>
  );
}

export default App;
