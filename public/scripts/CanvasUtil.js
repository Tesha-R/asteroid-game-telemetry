// CanvasUtil.js
const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext('2d');
context.fillStyle = 'black';
context.fillRect(0, 0, canvas.width, canvas.height);

export { canvas, context };
