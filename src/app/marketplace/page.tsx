import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { listMarketplacePage } from "@/lib/commerce";
import { ProductCard } from "@/components/product-card";

type Props = { searchParams: Promise<{ q?: string; category?: string; sort?: string; minPrice?: string; maxPrice?: string; page?: string }> };

export default async function MarketplacePage({ searchParams }: Props) {
  const params = await searchParams;
  const result = await listMarketplacePage(params);
  const products = result.products;
  const categories = ["Home & living", "Fashion", "Food & pantry"];
  function pageHref(page: number) {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.category) query.set("category", params.category);
    if (params.sort) query.set("sort", params.sort);
    if (params.minPrice) query.set("minPrice", params.minPrice);
    if (params.maxPrice) query.set("maxPrice", params.maxPrice);
    query.set("page", String(page));
    return "/marketplace?" + query.toString();
  }
  return (
    <main className="page-main">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Marketplace</span></div>
      <section className="listing-intro"><div><span className="eyebrow">THE EMPOWERBIZ MARKETPLACE</span><h1>A good place to<br /><em>find your next thing.</em></h1><p>Thoughtful finds from independent Kenyan businesses. Every order helps a small shop go a little further.</p></div><div className="listing-aside"><span className="aside-spark">✳</span><span>Shop small.<br />Find something<br />worth keeping.</span></div></section>
      <form className="market-toolbar" action="/marketplace">
        <label className="search-field"><Search size={18} /><input type="search" name="q" defaultValue={params.q} placeholder="Search products, shops, or good ideas..." /><button type="submit">Search</button></label>
        <label className="select-field"><SlidersHorizontal size={15} /><span className="sr-only">Category</span><select name="category" defaultValue={params.category ?? ""}><option value="">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label className="select-field sort-field"><span className="sr-only">Sort products</span><select name="sort" defaultValue={params.sort ?? "newest"}><option value="newest">Just added</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
        <label className="price-filter"><span>From KES</span><input name="minPrice" type="number" min="0" step="1" defaultValue={params.minPrice} placeholder="Any" /></label>
        <label className="price-filter"><span>To KES</span><input name="maxPrice" type="number" min="0" step="1" defaultValue={params.maxPrice} placeholder="Any" /></label>
        <input type="hidden" name="page" value="1" />
        <button className="filter-apply" type="submit">Apply filters</button>
      </form>
      <div className="listing-result"><span>{result.total} finds to explore</span><span>All from independent shops <i>✳</i></span></div>
      {products.length ? <div className="product-grid listing-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div> : <div className="empty-state"><span>✳</span><h2>Nothing here just yet.</h2><p>Try another search, or have a look at everything in the marketplace.</p><Link href="/marketplace">See all finds</Link></div>}
      {result.pageCount > 1 && <nav className="pagination" aria-label="Marketplace pages"><span>Page {result.page} of {result.pageCount}</span><div>{result.page > 1 && <Link href={pageHref(result.page - 1)}>Previous</Link>}{result.page < result.pageCount && <Link href={pageHref(result.page + 1)}>Next <span aria-hidden="true">→</span></Link>}</div></nav>}
    </main>
  );
}
