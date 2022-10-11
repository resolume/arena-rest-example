export interface ISourcePreset {
    id: number,
    name: string,
}

export interface ISource {
    idstring: string,
    name: string,
    presets: ISourcePreset[],
}

export interface ISources {
    [key: string]: ISource[],
}

export default ISources;
