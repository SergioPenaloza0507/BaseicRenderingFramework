export interface IAssetProcessorFactory<TObject extends any>
{
    Create(buffer : Uint8Array) : TObject;
}