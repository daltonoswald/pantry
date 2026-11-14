import { GoPlusCircle, GoCheckCircle, GoXCircle } from 'react-icons/go';
import { MdClose } from 'react-icons/md';
import { capFirst } from '../../utils/utility';
import usePantryItem from '../../utils/usePantryItem';

export default function PantryItemCard({ item, isOwnProfile, onRemoved }) {
    const { inPantry, isPending, add, remove } = usePantryItem(
        item.pantryItem.name,
        isOwnProfile || item.inMyPantry
    );
    const name = capFirst(item.pantryItem.name);

    const handleRemove = async () => {
        const removed = await remove();
        if (removed) onRemoved();
    }
    
    if (isOwnProfile && !inPantry) return null;

    return (
        <div className='pantry-item'>
            <h4>{name}</h4>

            {isOwnProfile ? (
                <button
                    className='pantry-item-remove'
                    aria-label={`Remove ${name} from your pantry`}
                    onClick={() => handleRemove(item)}
                    disabled={isPending}
                >
                    <MdClose />
                </button>
            ) : inPantry ? (
                // <span className='pantry-item-in-pantry' title='In your pantry'>
                //     <GoCheckCircle aria-label='In your pantry' />
                // </span>

                // <button
                //     className='pantry-item-remove'
                //     aria-label={`Remove ${name} from your pantry`}
                //     title='In your pantry. Click to remove.'
                //     onClick={remove}
                //     disabled={isPending}
                // >
                //     <GoXCircle />
                // </button>

                <button className='pantry-item-toggle' onClick={remove} disabled={isPending} aria-label={`Remove ${name} from your pantry`}>
                    <GoCheckCircle className='icon-have' />
                    <GoXCircle className='icon-remove' />
                </button>
            ) : (
                <button
                    className='pantry-item-add'
                    aria-label={`Add ${name} to your pantry`}
                    onClick={add}
                    disabled={isPending}
                >
                    <GoPlusCircle />
                </button>
            )}
        </div>
    )
}