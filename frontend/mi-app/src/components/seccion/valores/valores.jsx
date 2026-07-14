
import './valores.scss';

const valores = [
  {
    id: 1,
    title: "Ética y Valores Fundamentales",
    description: "Actuar con respeto e integridad, fomentando la confianza y la transparencia en todo lo que hacemos.",
    icon: "fa-solid fa-shield-halved", // 🛡️ Ética, protección, integridad
  },
  {
    id: 2,
    title: "Diversidad y Colaboración",
    description: "Abrazamos la diversidad y trabajamos juntos, valorando cada perspectiva para construir soluciones más humanas.",
    icon: "fa-solid fa-people-group", // 👥 Colaboración, diversidad
  },
  {
    id: 3,
    title: "Pasión y Compromiso",
    description: "Nos mueve el compromiso y el amor por lo que hacemos, creando desde el corazón con sentido y propósito.",
    icon: "fa-solid fa-heart", // ❤️ Pasión, amor, compromiso
  },
];

const Valores = () => {

    return(
        <div className='valores__container'>
            <div className='valores__content'>
                {
                    valores.map((valor) => (
                        <div key={valor.id} className='valores__item'>
                            <div className='valores__item-icon'>
                                <i className={valor.icon}></i>
                            </div>
                            <div className='valores__item-content'>
                                <h3 className='valores__item-title'>{valor.title}</h3>
                                <p className='valores__item-description'>{valor.description}</p>
                            </div>
                        </div>
                    ))
                }

            </div>

        </div>
    )
}
 
export default Valores;
