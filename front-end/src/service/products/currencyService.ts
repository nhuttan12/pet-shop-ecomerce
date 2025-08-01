class CurrencyService {
  private readonly RATE_VND_USD = 25000;

  async getCurrency(
    amount: number,
    from: "VND" | "USD",
    to: "VND" | "USD"): Promise<number> {
    // try {
    // const response = await axios.get(
    //   'https://v1.apiplugin.io/v1/currency/UEGHHQw7/convert',
    //   {
    //     params: {
    //       amount: amount,
    //       from,
    //       to,
    //     },
    //   }
    // );

    // return response.data;
    // } catch (error) {
    //   if (error instanceof AxiosError) {
    //     console.error(
    //       'Error:',
    //       error.response ? error.response.data : error.message
    //     );
    //   }
    //   throw error;
    // }
    if (from === "VND" && to === "USD") {
      return amount / this.RATE_VND_USD;
    }
    if (from === "USD" && to === "VND") {
      return amount * this.RATE_VND_USD;
    }

    // Same currency → return as is
    return amount;
  }
}

export default new CurrencyService();
