class CurrencyService {
  async getCurrency(amount: number): Promise<number> {
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

    return amount / 25000;
    // } catch (error) {
    //   if (error instanceof AxiosError) {
    //     console.error(
    //       'Error:',
    //       error.response ? error.response.data : error.message
    //     );
    //   }
    //   throw error;
    // }
  }
}

export default new CurrencyService();
