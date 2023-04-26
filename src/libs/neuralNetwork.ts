// neuralNetwork.ts

export class NeuralNetwork {
    inputNodes: number;
    hiddenNodes: number;
    outputNodes: number;
    learningRate: number;
    weightsInputHidden: number[][];
    weightsHiddenOutput: number[][];

    constructor(
        inputNodes: number,
        hiddenNodes: number,
        outputNodes: number,
        learningRate: number
    ) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;
        this.learningRate = learningRate;

        this.weightsInputHidden = this.initializeWeights(
            inputNodes,
            hiddenNodes
        );
        this.weightsHiddenOutput = this.initializeWeights(
            hiddenNodes,
            outputNodes
        );
    }

    public getWeightsInput(): number[][] {
        return this.weightsInputHidden;
    }

    public getWeightsOutput(): number[][] {
        return this.weightsHiddenOutput;
    }

    private initializeWeights(rows: number, cols: number): number[][] {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => Math.random() * 2 - 1)
        );
    }

    private sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    private sigmoidDerivative(x: number): number {
        return x * (1 - x);
    }

    public train(inputs: number[], targets: number[]): void {
        // Forward propagation
        const hiddenInputs = this.feedForward(inputs, this.weightsInputHidden);
        const hiddenOutputs = hiddenInputs.map(this.sigmoid);
        const finalInputs = this.feedForward(
            hiddenOutputs,
            this.weightsHiddenOutput
        );
        const finalOutputs = finalInputs.map(this.sigmoid);

        // Calculate output errors
        const outputErrors = targets.map((t, i) => t - finalOutputs[i]);

        // Backpropagate errors from output to hidden layer
        const hiddenErrors = this.weightsHiddenOutput.map((weights, i) =>
            outputErrors.reduce((sum, error, j) => sum + error * weights[j], 0)
        );

        // Update weights between hidden and output layers
        this.weightsHiddenOutput = this.weightsHiddenOutput.map((weights, i) =>
            weights.map(
                (weight, j) =>
                    weight +
                    this.learningRate *
                        outputErrors[j] *
                        finalOutputs[j] *
                        (1 - finalOutputs[j]) *
                        hiddenOutputs[i]
            )
        );

        // Update weights between input and hidden layers
        this.weightsInputHidden = this.weightsInputHidden.map((weights, i) =>
            weights.map(
                (weight, j) =>
                    weight +
                    this.learningRate *
                        hiddenErrors[j] *
                        hiddenOutputs[j] *
                        (1 - hiddenOutputs[j]) *
                        inputs[i]
            )
        );
    }

    public predict(inputs: number[]): number[] {
        const hiddenInputs = this.feedForward(inputs, this.weightsInputHidden);
        const hiddenOutputs = hiddenInputs.map(this.sigmoid);
        const finalInputs = this.feedForward(
            hiddenOutputs,
            this.weightsHiddenOutput
        );
        return finalInputs.map(this.sigmoid);
    }

    private transposeMatrix(matrix: number[][]): number[][] {
        return matrix[0].map((_, i) => matrix.map((row) => row[i]));
    }

    private feedForward(inputs: number[], weights: number[][]): number[] {
        const transposeWeights = this.transposeMatrix(weights);
        return transposeWeights.map((row, i) =>
            inputs.reduce((sum, input, j) => sum + input * row[j], 0)
        );
    }
}
