import iziToast from 'izitoast';
const position: string = 'topCenter';
const timeout = 3000;

export function success(message: string, title:string = "Sucesso") {
    iziToast.success({
      transitionIn:"bounceInDown",
      transitionOut:"fadeOutLeft",
        color: '#47ba7f', // blue, red, green, yellow
        progressBar: true,
        displayMode: 1, // once, replace
        position: position as any, 
        title: title,
        timeout:timeout,
        message: message
    });
}

export function warning(message: string, title: string = "Atenção") {
    iziToast.warning({
        transitionIn:"bounceInDown",
        transitionOut:"fadeOutLeft",
        progressBar: true,
        color: '#f5a23d',
        timeout:timeout,
        displayMode: 0, // once, replace
        position: position as any, 
        title: title,
        message: message
    });
}