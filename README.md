# tfjs-playgrounds

This repo contains some of my experiments with TensorFlow.

### Square Neural Network

Simple Convolutional Neural Network (CNN) which detects whether a 64x64px image contains a square or not.

Generates x squares and other shapes (circles, rectangles, triangles) which are then converted and used to test the network

To launch:

1. Go to a folder that interests you (e.g. `cd square_neural_network`)
2. Install dependencies using `yarn`
3. Launch `yarn everything` or go through each step
4. If you see an error saying `Error: The Node.js native addon module (tfjs_binding.node) can not be found at path:`, just run `yarn rebuildTensorFlow`
