import { CancellationToken, Disposable, DocumentHighlight, DocumentSelector, Position, TextDocument } from 'vscode-languageserver-protocol'
import { DocumentHighlightProvider } from './index'
import Manager, { ProviderItem } from './manager'
import uuid = require('uuid/v4')

export default class DocumentHighlightManager extends Manager<DocumentHighlightProvider> implements Disposable {

  public register(selector: DocumentSelector, provider: DocumentHighlightProvider): Disposable {
    let item: ProviderItem<DocumentHighlightProvider> = {
      id: uuid(),
      selector,
      provider
    }
    this.providers.add(item)
    return Disposable.create(() => {
      this.providers.delete(item)
    })
  }

  public async provideDocumentHighlights(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ): Promise<DocumentHighlight[]> {
    let item = this.getProvider(document)
    if (!item) return null
    let { provider } = item
    return await Promise.resolve(provider.provideDocumentHighlights(document, position, token))
  }

  public dispose(): void {
    this.providers = new Set()
  }
}
