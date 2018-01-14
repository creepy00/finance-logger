export default Object.freeze({
  formatAmount (amount) {
    return amount.toLocaleString(window.navigator.language, {
      minimumFractionDigits: 2
    });
  }
});
