import { ZDictionaryExporterSilent } from './dictionary-exporter-silent.class';

describe('ZDictionaryExporterSilent', () => {
  function createTestTarget() {
    return new ZDictionaryExporterSilent();
  }

  it('does nothing.', async () => {
    // Arrange
    const target = createTestTarget();
    // Act
    await target.write();
    // Assert
    expect(1).toEqual(1);
  });
});
