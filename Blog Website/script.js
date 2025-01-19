
document.addEventListener("DOMContentLoaded", () => {
    gsap.timeline()
      .to(".text-overlay", { 
        opacity: 1, 
        y: 0, 
        duration: 1.5, 
        ease: "power2.out", 
        delay:1 
      });
  });



 