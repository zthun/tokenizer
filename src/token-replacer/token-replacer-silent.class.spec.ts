import { ZTokenReplacerSilent } from './token-replacer-silent.class';

describe('ZTokenReplacerSilent', () => {
  function createTestTarget() {
    return new ZTokenReplacerSilent();
  }

  it('does not do anything on write.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    await target.write();
    // Assert
    expect(1).toEqual(1);
  });
});
