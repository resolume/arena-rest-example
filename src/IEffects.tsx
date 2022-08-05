export interface IEffect {
    idstring: string,
    name: string,
    presets: string[],
}

export interface IEffects {
    [key: string]: IEffect[],
}

export default IEffects;
