export const financeNav = {
  finance: {
    icon: 'mdi-piggy-bank',
    children: [
      {
        transactions: {
          icon: 'mdi-credit-card-multiple',
          children: {
            ':id': {
              icon: 'mdi-cash'
            },
            new: {
              icon: 'mdi-cash-plus'
            }
          }
        }

      }
    ]
  }
}
