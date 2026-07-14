import EventCalendar from'../../components/ui/calendar/calendar' 
import SEOHelmet from '../../components/seo/SEOHelmet/SEOHelmet';
import Header from '../../components/layout/header/header';
import CtaImgCuentaRgresiva from '../../components/seccion/cta_img_cuenta_rgresiva/cta_img_cuenta_rgresiva';
import MessageFinal from '../../components/seccion/message_final/message_final';
import CtaHablemos from '../../components/seccion/cta_hablemos/cta_hablemos';
import './calendar.router.scss';


const timerProps = {
  img: "/img/shared/manos-plantines.webp",
  titles: {
    main: "",
    subtitle: "Festival Eco de la Tierra",
  },
  text: " lorem ipsum dolor sit amet, con sectetuer adipiscing elit, sed diam nonummy nibh euis mod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
  buttonText: "Quiero participar",
  timer: {
    targetDate: "2025-09-23T18:59:59",
    link: "/servicios/laboratorios-alimentacion-viva"
  }
};

const CalendarRouter = () => {
  return (
    <div className="calendar-router__container">
        <SEOHelmet title='Calendar' description='Calendar' />

        <div className='calendar-router__header'>
            <Header> 
                <h1>Calendario</h1>
                <p>Consulta nuestro calendario de eventos y actividades.</p>
            </Header>
        </div>
      
        <div className='calendar-router__content'>
            <div className='calendar-router__content--calendar'>
                <EventCalendar />
            </div>

            <div className='calendar-router__content--cta'>
                <CtaImgCuentaRgresiva {...timerProps} />
            </div>

            <div className='calendar-router__content--hablemos'>
                <CtaHablemos />
            </div>
            
            <div className='calendar-router__content--message'>
                <MessageFinal indexMessage={2} />
            </div>
        </div>
    </div>
  );
};

export default CalendarRouter;
