# Interactive World
- Library: [THREE.js](https://threejs.org/)
- A simple world where players can: 
  - Control their views by moving the mouse and pressing UP-DOWN-LEFT-RIGHT keys. 
  - Press Space + Left Mouse Click to: 
    - Plant flowers on the floor or on top of each other
    - Turn yellow-leaf trees back to green-leaf trees 
    - Plant ducky inflatables on the water object
    - Plant ice blocks on the ice object
    - Plant minerals on mountain and lava objects
- To run project in local environment, install a local server for web development. An option I used is [Servez](https://greggman.github.io/servez/). You can follow the link to quickly set up node.js (if you haven't had it) and the local server on your computer (under the Development/Setup section on the website). After finishing the setup, run this command anywhere in the terminal:
```
servez [path to project folder]
```
For example, in my case I run Servez server with this command:
```
servez /Users/maddietong/threejs/threejs-project
```
Then, open your web browser and run the project on localhost:
```
localhost:8080
```
# Acknowledgements
- [THREE.js examples and codes](https://threejs.org/examples/#webgl_animation_keyframes)
- Stackoverflow for researching and debugging
