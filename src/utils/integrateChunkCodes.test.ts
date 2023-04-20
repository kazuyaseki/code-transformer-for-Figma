import {
  getChunkReplaceMarker,
  integrateChunkCodes,
} from './integrateChunkCodes';

test('integrateChunkCodes', () => {
  const result = integrateChunkCodes(
    rootCode(getChunkReplaceMarker(nodeId)),
    chunks
  );

  const expected = rootCode(chunks[0].code);

  expect(result).toBe(expected);
});

const nodeId = '149:20060';

const rootCode = (chunk: string) => `import React from 'react';
import { HomeNaviButton } from '@/components/HomeNaviButton';
import { Tabs } from '@/components/Tabs';
import { Header } from '@/components/Header';
import { BottomNavigation } from '@/components/BottomNavigation';
import { FloatActionButton } from '@/components/FloatActionButton';

export const HOMContainer: React.FC = () => {
  return (
    <div className="w-375 h-812 bg-Light/Background/Plain">
      <div className="rounded-xl flex flex-col items-center justify-start space-y-spacing.md">
        <Tabs TabsItem="2" Scrollable="false" Theme="Light" />
        ${chunk}
      </div>
      <Header />
      <BottomNavigation Property1="Home" />
      <FloatActionButton Type="Primary" Size="Lg" Status="Default" Lable="false" />
    </div>
  );
};`;

const chunks = [
  {
    id: nodeId,
    code: `<section>
  hogehoge
</section>`,
  },
];
