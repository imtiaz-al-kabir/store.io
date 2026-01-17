import Link from 'next/link';
import Image from 'next/image';

export default function ItemCard({ item }) {
    return (
        <div className="group relative bg-card rounded-xl border border-border/50 hover:border-border transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-muted relative">
                <Image
                    src={item.image}
                    alt={item.name}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-medium truncate">{item.name}</p>
                </div>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-semibold text-foreground leading-tight">
                        <Link href={`/items/${item.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {item.name}
                        </Link>
                    </h3>
                    <p className="text-base font-bold text-primary ml-4">${item.price}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{item.description}</p>

                <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    View Details →
                </div>
            </div>
        </div>
    );
}
