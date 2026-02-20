class Particle {
    constructor(ctx, properties) {
        this.ctx = ctx;
        this.position = properties.position;
        this.velocity = properties.velocity;
        this.size = properties.size;
        this.config = properties.config;
    }

    update() {
        this.#move();
        this.#interactWithMouse();
    }

    #move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    isOutOfBorders() {
        return Math.max(-this.position.x, -this.position.y, this.position.x - this.ctx.canvas.width, this.position.y - this.ctx.canvas.height) > this.config.canvas.margin;
    }

    #interactWithMouse() {
        if(!this.ctx.canvas.mousePosition) return;
        if(this.#calculateDistanceToMouse() < this.config.interaction.distance)
            this.#moveAwayFromMouse();
    }

    #calculateDistanceToMouse() {
        const deltaX = this.ctx.canvas.mousePosition.x - this.position.x;
        const deltaY = this.ctx.canvas.mousePosition.y - this.position.y;

        return Math.hypot(deltaX, deltaY);
    }

    #moveAwayFromMouse() {        
        const angleFromMouse = this.#calculateAngleFromPoint(this.ctx.canvas.mousePosition);
        this.position = { ...this.ctx.canvas.mousePosition };
        this.#moveWithMagnitudeAndAngle(this.config.interaction.distance, angleFromMouse);
    }

    #calculateAngleFromPoint(point) {
        const deltaX = this.position.x - point.x;
        const deltaY = this.position.y - point.y;
        return Math.atan2(deltaY, deltaX);
    }

    #moveWithMagnitudeAndAngle(magnitude, angle) {
        this.position.x += magnitude * Math.cos(angle);
        this.position.y += magnitude * Math.sin(angle);
    }

    render(particleCollection) {
        this.#renderParticleCircle();
        particleCollection.forEach(otherParticle => this.#connectParticlesWithLine(otherParticle));
    }

    #renderParticleCircle() {
        this.#drawCircle(this.position.x, this.position.y, this.size, this.config.particles.color);
    }

    #drawCircle(x, y, radius, color) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    #connectParticlesWithLine(otherParticle) {
        const distance = this.#calculateDistanceBetweenParticles(this, otherParticle);
        if (!this.#isWithinConnectionRange(distance)) return;

        const lineOpacity = this.#calculateLineOpacity(distance);
        this.#drawConnectingLine(otherParticle, lineOpacity);
    }

    #calculateDistanceBetweenParticles(particle1, particle2) {
        const deltaX = particle1.position.x - particle2.position.x;
        const deltaY = particle1.position.y - particle2.position.y;
        return Math.hypot(deltaX, deltaY);
    }

    #isWithinConnectionRange(distance) {
        return distance <= this.config.lines.maxLength;
    }

    #calculateLineOpacity(distance) {
        return 1 - (distance / this.config.lines.maxLength);
    }

    #drawConnectingLine(otherParticle, opacity) {
        this.ctx.globalAlpha = opacity;
        this.#drawLine(
            this.position.x, 
            this.position.y, 
            otherParticle.position.x, 
            otherParticle.position.y, 
            this.config.lines.width, 
            this.config.lines.color
        );
        this.ctx.globalAlpha = 1;
    }

    #drawLine(x1, y1, x2, y2, width, color) {
        this.ctx.beginPath();
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}

export class ParticleCanvas {
    constructor(canvas, config) {
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.margin = config.canvas.margin;
        this.config = config;
        this.#load();
    }

    #load() {
        this.#recordMousePosition();
        this.#createStartingParticles();
        window.requestAnimationFrame(() => this.#animate());
    }

    #recordMousePosition() {
        this.ctx.canvas.addEventListener('mousemove', (e) => this.#updateMousePositionOnMouseMove(e));
    }

    #updateMousePositionOnMouseMove(e) {
        const rect = this.ctx.canvas.getBoundingClientRect();
        this.ctx.canvas.mousePosition = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
    }

    #createStartingParticles() {
        this.particles = [];

        for(let i = 0; i < this.config.particles.number; i++) {
            this.particles.push(this.#createStartingParticle());
        }
    }

    #createStartingParticle() {
        return new Particle(this.ctx, this.#createStartingParticleProperties());
    }

    #createStartingParticleProperties() {
        return {
            position: this.#calculateInitialPositionOfStartingParticle(),
            velocity: this.#calculateInitialVelocityOfStartingParticle(),
            size: this.#getRandomInRange(this.config.particles.size.min, this.config.particles.size.max),
            config: this.config,
        }
    }

    #calculateInitialPositionOfStartingParticle() {
        return {
            x: Math.random() * this.#widthPlusMargins() - this.margin,
            y: Math.random() * this.#heightPlusMargins() - this.margin,
        }
    }
    
    #widthPlusMargins() {
        return this.width + 2 * this.margin;
    }

    #heightPlusMargins() {
        return this.height + 2 * this.margin;
    }
    
    #calculateInitialVelocityOfStartingParticle() {
        const magnitude = this.#getRandomInRange(this.config.particles.velocity.min, this.config.particles.velocity.max);
        const angle = Math.random() * 360;

        return this.#magnitudeAndAngleToXY(magnitude, angle);
    }

    #getRandomInRange(min, max) {
        if(min > max) return this.#getRandomInRange(max, min);

        return min + (max - min) * Math.random();
    }

    #magnitudeAndAngleToXY(magnitude, angle) {
        return {
            x: magnitude * Math.cos(angle),
            y: magnitude * Math.sin(angle),
        }
    }

    #animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.particles.forEach(particle => particle.update( ));
        this.particles.forEach((particle, index) => this.#checkIfParticleIsOutOfBorders(particle, index));
        this.particles.forEach(particle => particle.render(this.particles));

        window.requestAnimationFrame(() => this.#animate());
    }

    #checkIfParticleIsOutOfBorders(particle, index) {
        if(particle.isOutOfBorders()) 
            this.#replaceParticle(index); 
    }

    #replaceParticle(index) {
        this.particles[index] = this.#createNewParticle();
    }

    #createNewParticle() {
        return new Particle(this.ctx, this.#createNewParticleProperties());
    }

    #createNewParticleProperties() {
        const side = this.#determineStartingSide();

        return {
            position: this.#calculateInitialPositionOfNewParticle(side),
            velocity: this.#calculateInitialVelocityOfNewParticle(side),
            size: this.#getRandomInRange(this.config.particles.size.min, this.config.particles.size.max),
            config: this.config,
        }
    }

    #determineStartingSide() {
        // TOP: 0, RIGHT: 1, BOTTOM: 2, LEFT: 3
        const isVertical = Math.random() < this.height / (this.width + this.height);
        const isPositiveDirection = Math.random() > 0.5;

        return isVertical + 2 * isPositiveDirection;
    }

    #calculateInitialPositionOfNewParticle(side) {
        return {
            x: this.#calculateStartX(side),
            y: this.#calculateStartY(side)
        };
    }

    #calculateStartX(side) {
        switch (side) {
            case 1:
                return this.width + this.margin;
            case 3:
                return -this.margin;
            default:
                return Math.random() * this.#widthPlusMargins() - this.margin;
        }
    }

    #calculateStartY(side) {
        switch (side) {
            case 0:
                return -this.margin;
            case 2:
                return this.height + this.margin;
            default:
                return Math.random() * this.#heightPlusMargins() - this.margin;
        }
    }

    #calculateInitialVelocityOfNewParticle(side) {
        const magnitude = this.#getRandomInRange(this.config.particles.velocity.min, this.config.particles.velocity.max);
        const angle = [270, 180, 90, 0][side] + this.#getRandomInRange(-90, 90);

        return this.#magnitudeAndAngleToXY(magnitude, angle);
    }
}