const h1 = document.querySelector("h1");
const h2 = document.querySelector("h2");

document.addEventListener('scroll', (e) => {
    let scrolled = (document.documentElement.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    if(scrolled * 100 < 50){
        h1.style.setProperty('--percentage', `${scrolled * 200}%`);
    }else{
     h2.style.setProperty('--percentage', `${(scrolled-0.5) * 200}%`);
    }
});