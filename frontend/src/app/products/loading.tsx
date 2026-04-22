export default function Loading() {
    return (
        <div className="container mx-auto px-4 md:px-8 py-24">
            <div className="mb-12">
                <div className="h-12 w-1/3 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                <div className="h-6 w-1/2 bg-gray-200 rounded-md animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[300px] p-4">
                {[...Array(8)].map((_, index) => {
                    const isFeatured = index === 0 || index === 5;
                    const isTall = index === 2;

                    return (
                        <div
                            key={index}
                            className={`group relative overflow-hidden rounded-2xl bg-gray-200 animate-pulse ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''
                                } ${isTall ? 'md:row-span-2' : ''}`}
                        >
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
