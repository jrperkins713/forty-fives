import Card from './Card.js'
export default function CardHand({controller, cards = []}) {
    return (
      <div class="flex flex-row bg-black h-24 w-full">
        {cards.map((card, idx)=><Card controller={controller} key={`${card.rank}${card.suit}`} card={card}></Card>)}
        
      </div>
    );
}