window.onload = function () {
    Particles.init({
        selector: ".background"
    });
};
const particles = Particles.init({
    selector: ".background",
    maxParticles: 150,
    color: ["#03dac6", "#ff0266", "#000000"],
    connectParticles: true,
    responsive: [
        {
            breakpoint: 768,
            options: {
                color: ["#faebd7", "#03dac6", "#ff0266"],
                maxParticles: 80,
                connectParticles: true
            }
        }, {
            breakpoint: 425,
            options: { maxParticles:100,
                connectParticles: true
            }
        }, {
            breakpoint:320,
            options: {
                maxParticles: 0
            }
        }
    ],
});

