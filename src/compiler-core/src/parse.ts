import { NodeTypes } from './ast';

export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}

function parseChildren(context) {
  const nodes: any = [];
  let node;
  if (context.source.startsWith('{{')) {
    node = parseInterpolaction(context);
    nodes.push(node);
  }

  return nodes;
}

function parseInterpolaction(context) {
  const openDelimiter = '{{';
  const closeDelimiter = '}}';
  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length,
  );
  advanceBy(context, openDelimiter.length);
  const rawContentLength = closeIndex - openDelimiter.length;
  const rawContent = context.source.slice(0, rawContentLength);
  const content = rawContent.trim();
  advanceBy(context, rawContentLength + closeDelimiter.length);

  // console.log('context.source', context.source);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function advanceBy(context: any, openDelimiterLength: number) {
  context.source = context.source.slice(openDelimiterLength);
}

function createRoot(children) {
  return {
    children,
  };
}

function createParserContext(content: any) {
  return {
    source: content,
  };
}
