export type UnitType = 'px' | 'rem' | 'remAs10px';

export function buildSizeStringByUnit(pixelValue: number): string {
  return pixelValue + 'px';
}

export type CSSData = {
  [key in string]: string | number | boolean;
};

export class TextCount {
  count = 1;
  constructor() {
    return;
  }

  increment() {
    this.count++;
  }
}

const justifyContentCssValues = {
  MIN: 'flex-start',
  MAX: 'flex-end',
  CENTER: 'center',
  SPACE_BETWEEN: 'space-between',
};

const alignItemsCssValues = {
  MIN: 'flex-start',
  MAX: 'flex-end',
  CENTER: 'center',
  BASELINE: 'baseline',
};

const textAlignCssValues = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  JUSTIFIED: 'justify',
};

const textVerticalAlignCssValues = {
  TOP: 'top',
  CENTER: 'middle',
  BOTTOM: 'bottom',
};

const textDecorationCssValues = {
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'line-through',
};

export function getCssDataForTag(node: SceneNode): CSSData {
  const properties: CSSData = {};

  // skip vector since it's often displayed as an img tag
  if (node.visible && node.type !== 'VECTOR') {
    if ('opacity' in node && (node?.opacity || 1) < 1) {
      properties['opacity'] = node.opacity || 1;
    }
    if ('rotation' in node && node.rotation !== 0) {
      properties['transform'] = `rotate(${Math.floor(node.rotation)}deg)`;
    }

    if ('layoutPositioning' in node && node.layoutPositioning === 'ABSOLUTE') {
      properties['position'] = 'absolute';
      properties['left'] = buildSizeStringByUnit(node.x);
      properties['top'] = buildSizeStringByUnit(node.y);
    }

    if (
      node.type === 'FRAME' ||
      node.type === 'INSTANCE' ||
      node.type === 'COMPONENT'
    ) {
      const borderRadiusValue = getBorderRadiusString(node);
      if (borderRadiusValue) {
        properties['border-radius'] = borderRadiusValue;
      }

      if (node.layoutMode !== 'NONE') {
        properties['display'] = 'flex';
        properties['flex-direction'] =
          node.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
        properties['justify-content'] =
          justifyContentCssValues[node.primaryAxisAlignItems];
        properties['align-items'] =
          alignItemsCssValues[node.counterAxisAlignItems];

        if (
          node.paddingTop === node.paddingBottom &&
          node.paddingTop === node.paddingLeft &&
          node.paddingTop === node.paddingRight
        ) {
          if (node.paddingTop > 0) {
            properties['padding'] = buildSizeStringByUnit(node.paddingTop);
          }
        } else if (
          node.paddingTop === node.paddingBottom &&
          node.paddingLeft === node.paddingRight
        ) {
          properties['padding'] = `${buildSizeStringByUnit(
            node.paddingTop
          )} ${buildSizeStringByUnit(node.paddingLeft)}`;
        } else {
          properties['padding'] = `${buildSizeStringByUnit(
            node.paddingTop
          )} ${buildSizeStringByUnit(
            node.paddingRight
          )} ${buildSizeStringByUnit(
            node.paddingBottom
          )} ${buildSizeStringByUnit(node.paddingLeft)}`;
        }

        if (
          node.primaryAxisAlignItems !== 'SPACE_BETWEEN' &&
          node.itemSpacing > 0
        ) {
          properties['gap'] = buildSizeStringByUnit(node.itemSpacing);
        }
      } else {
        setWidthAndHeight(node, properties);
      }

      // FIXME:複数のスタイルある時の挙動未確認
      setColorProperty(
        node.fills as Paint[],
        node.fillStyleId as string,
        properties,
        'background-color'
      );

      setBorderProperty(
        node.strokes as Paint[],
        node.strokeStyleId,
        properties,
        node.strokeWeight,
        {
          top: node.strokeTopWeight,
          left: node.strokeLeftWeight,
          right: node.strokeRightWeight,
          bottom: node.strokeBottomWeight,
        }
      );
    }

    if (node.type === 'RECTANGLE') {
      const borderRadiusValue = getBorderRadiusString(node);
      if (borderRadiusValue) {
        properties['border-radius'] = borderRadiusValue;
      }

      properties['height'] = Math.floor(node.height) + 'px';
      properties['width'] = Math.floor(node.width) + 'px';

      setColorProperty(
        node.fills as Paint[],
        node.fillStyleId as string,
        properties,
        'background-color'
      );

      setBorderProperty(
        node.strokes as Paint[],
        node.strokeStyleId,
        properties,
        node.strokeWeight,
        {
          top: node.strokeTopWeight,
          left: node.strokeLeftWeight,
          right: node.strokeRightWeight,
          bottom: node.strokeBottomWeight,
        }
      );
    }

    if (node.type === 'TEXT') {
      const style = figma.getStyleById(node.textStyleId as string);

      if (style) {
        properties['typography'] = style.name;
      } else {
        setColorProperty(
          node.fills as Paint[],
          node.fillStyleId as string,
          properties,
          'color'
        );

        properties['text-align'] = textAlignCssValues[node.textAlignHorizontal];
        properties['vertical-align'] =
          textVerticalAlignCssValues[node.textAlignVertical];
        properties['font-size'] = `${node.fontSize as number}px`;
        properties['font-family'] = (node.fontName as FontName).family;

        const letterSpacing = node.letterSpacing as LetterSpacing;
        if (letterSpacing.value !== 0) {
          properties['letter-spacing'] =
            letterSpacing.unit === 'PIXELS'
              ? buildSizeStringByUnit(letterSpacing.value)
              : letterSpacing.value + '%';
        }

        type LineHeightWithValue = {
          readonly value: number;
          readonly unit: 'PIXELS' | 'PERCENT';
        };

        properties['line-height'] =
          (node.lineHeight as LineHeight).unit === 'AUTO'
            ? 'auto'
            : (node.letterSpacing as LetterSpacing).unit === 'PIXELS'
            ? buildSizeStringByUnit(
                (node.lineHeight as LineHeightWithValue).value
              )
            : (node.lineHeight as LineHeightWithValue).value + '%';

        if (
          node.textDecoration === 'STRIKETHROUGH' ||
          node.textDecoration === 'UNDERLINE'
        ) {
          properties['text-decoration'] =
            textDecorationCssValues[node.textDecoration];
        }
      }
    }

    if (node.type === 'LINE') {
      setWidthAndHeight(node, properties);

      setBorderProperty(
        node.strokes as Paint[],
        node.strokeStyleId,
        properties,
        node.strokeWeight,
        null
      );
    }

    if (
      node.type === 'GROUP' ||
      node.type === 'ELLIPSE' ||
      node.type === 'POLYGON' ||
      node.type === 'STAR'
    ) {
      setWidthAndHeight(node, properties);
    }
  }

  setFigmaTokens(node, properties);

  return properties;
}

function setFigmaTokens(node: SceneNode, properties: CSSData) {
  const tokenKeys = node
    .getSharedPluginDataKeys('tokens')
    // Omit "version" and "hash" because they are not tokens
    .filter((key) => key !== 'version' && key !== 'hash');

  tokenKeys.forEach((key) => {
    const value = node.getSharedPluginData('tokens', key);
    if (value) {
      // remove css that's represented by token
      if (key === 'itemSpacing') {
        delete properties['gap'];
      }

      properties[key] = value.replaceAll('"', '');
    }
  });
}

function getBorderRadiusString(
  node: FrameNode | RectangleNode | ComponentNode | InstanceNode
) {
  if (node.cornerRadius !== 0) {
    if (typeof node.cornerRadius !== 'number') {
      return `${buildSizeStringByUnit(
        node.topLeftRadius
      )} ${buildSizeStringByUnit(node.topRightRadius)} ${buildSizeStringByUnit(
        node.bottomRightRadius
      )} ${buildSizeStringByUnit(node.bottomLeftRadius)}`;
    }
    return `${buildSizeStringByUnit(node.cornerRadius)}`;
  }
  return null;
}

function rgbValueToHex(value: number) {
  return Math.floor(value * 255)
    .toString(16)
    .padStart(2, '0');
}

function buildColorString(paint: Paint) {
  if (paint && 'type' in paint && paint.type === 'SOLID') {
    if (paint.opacity !== undefined && paint.opacity < 1) {
      return `rgba(${Math.floor(paint.color.r * 255)}, ${Math.floor(
        paint.color.g * 255
      )}, ${Math.floor(paint.color.b * 255)}, ${paint.opacity})`;
    }
    return `#${rgbValueToHex(paint.color.r)}${rgbValueToHex(
      paint.color.g
    )}${rgbValueToHex(paint.color.b)}`;
  }

  return '';
}

function setWidthAndHeight(node: SceneNode, properties: CSSData) {
  if (node.width && node.height) {
    properties['width'] = Math.floor(node.width) + 'px';
    properties['height'] = Math.floor(node.height) + 'px';
  }
}

function setColorProperty(
  fills: Paint[],
  colorStyleId: string,
  properties: CSSData,
  colorProp: 'background-color' | 'color'
) {
  if ((fills as Paint[]).length > 0 && (fills as Paint[])[0].type !== 'IMAGE') {
    const style = figma.getStyleById(colorStyleId);
    const paint = (fills as Paint[])[0];

    const color = style ? style.name : buildColorString(paint);
    properties[colorProp] = color;
  }
}

function setBorderProperty(
  strokes: Paint[],
  colorStyleId: string,
  properties: CSSData,
  strokeWeight: number | typeof figma.mixed,
  individualBorders: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  } | null
) {
  if (strokes.length > 0) {
    const style = figma.getStyleById(colorStyleId);
    const paint = strokes[0];

    const color = style ? style.name : buildColorString(paint);

    if (typeof strokeWeight === 'number') {
      properties['border'] = `${buildSizeStringByUnit(
        strokeWeight
      )} solid ${color}`;
    } else {
      if (!individualBorders) return;

      properties['border-top'] = `${buildSizeStringByUnit(
        individualBorders.top
      )} solid ${color}`;
      properties['border-right'] = `${buildSizeStringByUnit(
        individualBorders.right
      )} solid ${color}`;
      properties['border-bottom'] = `${buildSizeStringByUnit(
        individualBorders.bottom
      )} solid ${color}`;
      properties['border-left'] = `${buildSizeStringByUnit(
        individualBorders.left
      )} solid ${color}`;
    }
  }
}
