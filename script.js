// Simple catch-the-cubes game using Three.js
let scene, camera, renderer;
let paddle;
const paddleWidth = 2;
const paddleHeight = 0.5;
const paddleDepth = 0.5;
let cubes = [];
let score = 0;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    // Paddle
    const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle.position.y = -3;
    scene.add(paddle);

    camera.position.z = 5;

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    spawnCube();
    animate();
}

function onMouseMove(event) {
    // Normalized mouse x (-1 to 1)
    const xNorm = (event.clientX / window.innerWidth) * 2 - 1;
    // Map to world coordinates; adjust range as needed
    paddle.position.x = xNorm * 4;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function spawnCube() {
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = (Math.random() * 2 - 1) * 4;
    cube.position.y = 5;
    scene.add(cube);
    cubes.push(cube);
    // Spawn another cube in 1 second
    setTimeout(spawnCube, 1000);
}

function animate() {
    requestAnimationFrame(animate);
    // Update cubes
    for (let i = cubes.length - 1; i >= 0; i--) {
        const cube = cubes[i];
        cube.position.y -= 0.05;
        // Collision detection with paddle
        if (
            cube.position.y <= paddle.position.y + paddleHeight / 2 &&
            Math.abs(cube.position.x - paddle.position.x) < (paddleWidth + 0.5) / 2
        ) {
            // Caught cube
            scene.remove(cube);
            cubes.splice(i, 1);
            score++;
            updateScore();
        } else if (cube.position.y < -5) {
            // Missed cube
            scene.remove(cube);
            cubes.splice(i, 1);
            score = Math.max(0, score - 1);
            updateScore();
        }
    }
    renderer.render(scene, camera);
}

function updateScore() {
    const scoreElem = document.getElementById('score');
    if (scoreElem) {
        scoreElem.textContent = score.toString();
    }
}

init();
