export default function Card({controller, card}) {
    if (!card) {
      return (
        <div class={`border-2 -left-1 border-black bg-white h-24 w-16}`}>
        </div>
      );
    }
    const suit = card.suit;
    const rank = card.rank;
    const color = suit === 'Hearts' || suit === 'Diamonds' ? 'text-red-600' : 'text-black';
    const suitSymbols = {
        'Hearts': '\u2665',
        'Diamonds': '\u2666',
        'Spades': '\u2660',
        'Clubs': '\u2663 '
    }

    let clickAction = ()=>{}
    if(controller){ 
      if (controller._status === 'PLAYING') {
        clickAction = ()=>{controller.applyMove(card)}
      }
      if (controller._status === 'DISCARD') {
        clickAction = ()=>{controller.discardCard(card)}
      }
      
    }
    return (
      <div onClick={clickAction} class={`grid grid-rows-4 border-2 -left-1 border-black bg-white h-24 w-16 ${color}`}>
        <div class={`row-span-1`}>{rank}</div>
        <div class='row-span-2 flex justify-center items-center'>{suitSymbols[suit]}</div>
        <div class={`row-span-1 text-right`}>{rank}</div>
      </div>
    );
}