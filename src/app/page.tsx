'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import GenerateTab from '@/components/GenerateTab';
import InpaintTab from '@/components/InpaintTab';
import EraseTab from '@/components/EraseTab';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Home() {
  return (
    <div>
      <main>
        <div className="container">
          <div className="header">
            <h1>Stability AI Image Editor</h1>
            <p>Generate, inpaint, and erase images using Stability AI</p>
          </div>

          <div className="card">
            <Tab.Group>
              <Tab.List className="tabs">
                {['Generate', 'Inpaint', 'Erase'].map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      classNames(
                        'tab',
                        selected ? 'active' : ''
                      )
                    }
                  >
                    {tab}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="tab-content">
                <Tab.Panel>
                  <GenerateTab />
                </Tab.Panel>
                <Tab.Panel>
                  <InpaintTab />
                </Tab.Panel>
                <Tab.Panel>
                  <EraseTab />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </main>
    </div>
  );
}
