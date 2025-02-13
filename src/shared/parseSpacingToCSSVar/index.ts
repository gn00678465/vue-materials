export type SpacingType = 'padding' | 'margin';

/**
 * 解析 CSS spacing 值並生成對應的 CSS 變數對象
 * @param value - CSS spacing 值 (例如: "10px", "10px 20px", "10px 20px 30px", "10px 20px 30px 40px")
 * @param prefix - CSS 變數前綴
 * @param type - spacing 類型 ('padding' 或 'margin')
 * @returns 包含 CSS 變數的對象
 */
export function parseSpacingToCSSVar(
  value: string,
  prefix: string = '',
  type: SpacingType = 'padding',
  size: string = ''
): Record<string, string> {
  // 處理 calc 表達式和其他複雜值
  const splitComplexValue = (str: string): string[] => {
    const values: string[] = [];
    let current = '';
    let parentheses = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (char === '(') {
        parentheses++;
        current += char;
      } else if (char === ')') {
        parentheses--;
        current += char;
      } else if (char === ' ' && parentheses === 0) {
        if (current) {
          values.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) {
      values.push(current.trim());
    }

    return values;
  };

  // 生成變數名稱
  const getVariableName = (side: string): string => {
    const parts: string[] = [type];
    if (size) {
      parts.push(size);
    }
    parts.push(side);
    return `--${prefix}${parts.filter(Boolean).join('-')}`;
  };

  // 移除多餘空格並分割值
  const values = splitComplexValue(value.trim())

  if (values.length === 0 || values.length > 4) {
    throw new Error('Invalid spacing value format');
  }

  const result: Record<string, string> = {};

  // 根據傳入值的數量處理不同情況
  switch (values.length) {
    case 1:
      // 所有方向使用相同值
      ['top', 'right', 'bottom', 'left'].forEach(side => {
        result[getVariableName(side)] = values[0];
      });
      break;

    case 2:
      // 垂直和水平方向使用不同值
      ['top', 'bottom'].forEach(side => {
        result[getVariableName(side)] = values[0];
      });
      ['right', 'left'].forEach(side => {
        result[getVariableName(side)] = values[1];
      });
      break;

    case 3:
      // 上、水平、下方向使用不同值
      result[getVariableName('top')] = values[0];
      ['right', 'left'].forEach(side => {
        result[getVariableName(side)] = values[1];
      });
      result[getVariableName('bottom')] = values[2];
      break;

    case 4:
      // 所有方向使用不同值
      ['top', 'right', 'bottom', 'left'].forEach((side, index) => {
        result[getVariableName(side)] = values[index];
      });
      break;
  }

  return result;
}
