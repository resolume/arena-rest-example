export interface IEffectPreset {
    id: number,
    name: string,
}

export interface IEffect {
    idstring: string,
    name: string,
    presets: IEffectPreset[],
}

export interface IEffects {
    [key: string]: IEffect[],
}

export default IEffects;
