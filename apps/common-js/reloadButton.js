const button = document.createElement("div");
button.setAttribute("id", "ButtonReload");
reload = () => location.reload();

button.onclick = reload;

button.style =
  "position: fixed; top: 10px; right: 10px; width: 80px; height: 80px";

button.innerHTML = `<svg fill="#000000" width="100%" height="100%" viewBox="0 0 512 512">
<path
  d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48ZM376,238.77H287l36.88-36.88-5.6-6.51a87.38,87.38,0,1,0-62.94,148,87.55,87.55,0,0,0,82.42-58.25L343.13,270l30.17,10.67L368,295.8A119.4,119.4,0,1,1,255.38,136.62a118.34,118.34,0,0,1,86.36,36.95l.56.62,4.31,5L376,149.81Z"
/>
</svg>`;

document.body.appendChild(button);
