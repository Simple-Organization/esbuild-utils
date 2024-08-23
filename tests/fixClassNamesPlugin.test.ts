import { expect, test } from '@playwright/test';
import { fixClassNamesParseContent } from '../src/plugins/fixClassNamesPlugin';

//
//

test.describe('fixClassNamesPlugin', () => {
  test('Should fix class name', () => {
    const content = `
var SomeClass = class {
  myMethod() {
}`;

    const fixedContent = fixClassNamesParseContent(content);

    expect(fixedContent).toBe(`
class SomeClass {
  myMethod() {
}`);
  });

  //
  //

  test('Should fix class name with extends', () => {
    const content = `
var SomeClass = class extends SomeOtherClass {
  myMethod() {
}`;

    const fixedContent = fixClassNamesParseContent(content);

    expect(fixedContent).toBe(`
class SomeClass extends SomeOtherClass {
  myMethod() {
}`);
  });

  //
  //

  test('Should remove internal', () => {
    const content = `
var SomeClass = class {
  /** @internal */
  myMethod() {
}`;

    const fixedContent = fixClassNamesParseContent(content);

    expect(fixedContent).toBe(`
class SomeClass {
  myMethod() {
}`);
  });
});
