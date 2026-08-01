import React from 'react'
import ReactDOM from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { ClassShell } from '../../src/class-manifests/ClassShell'
import { fixtureClassManifest, fixtureOrder, fixtureRegistry } from '../../src/class-manifests/__fixtures__/classManifest'
import type { Catalog } from '../../src/types'
import '../../src/styles.css'

const catalog = await fetch('/data/catalog.json').then((response) => response.json()) as Catalog

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MemoryRouter initialEntries={['/compendium/classes/class.fixture']}>
      <ClassShell
        catalog={catalog}
        manifest={fixtureClassManifest}
        registry={fixtureRegistry}
        order={fixtureOrder}
        pageState="overview"
      />
    </MemoryRouter>
  </React.StrictMode>,
)
