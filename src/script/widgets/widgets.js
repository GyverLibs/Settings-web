import './widgets.css';

import ColorWidget from "./color";
import LabelWidget from "./label";
import PassWidget from "./pass";
import SelectWidget from "./select";
import SliderWidget from "./slider";
import SwitchWidget from "./switch";
import { DateWidget, DateTimeWidget, TimeWidget } from "./time";
import InputWidget from "./input";
import ButtonsWidget from "./buttons";
import ParagraphWidget from "./paragraph";
import Button from "./button";
import ConfirmWidget from "./confirm";
import LedWidget from "./led";
import NumberWidget from './number';
import LogWidget from './log';
import Slider2Widget from './slider2';
import HTMLWidget from './html';
import ImageWidget from './image';
import StreamWidget from './stream';
import TabsWidget from './tabs';

export const WidgetList = {
    toggle: SwitchWidget,
    input: InputWidget,
    number: NumberWidget,
    pass: PassWidget,
    select: SelectWidget,
    time: TimeWidget,
    date: DateWidget,
    datetime: DateTimeWidget,
    slider: SliderWidget,
    slider2: Slider2Widget,
    label: LabelWidget,
    color: ColorWidget,
    buttons: ButtonsWidget,
    button: Button,
    paragraph: ParagraphWidget,
    confirm: ConfirmWidget,
    led: LedWidget,
    log: LogWidget,
    html: HTMLWidget,
    image: ImageWidget,
    stream: StreamWidget,
    tabs: TabsWidget,
}