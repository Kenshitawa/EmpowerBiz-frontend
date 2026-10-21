import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { addToCartAction } from "@/app/actions";
import { formatKes, type Product } from "@/lib/commerce";

const motifs = ["motif-home", "motif-bag", "motif-food", "motif-vase"];

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <article className="product-card">
      <Link href={"/products/" + product.slug} className={"product-image " + motifs[index % motifs.length]} style={{ backgroundColor: product.color }}>
        <span className="stock-label">In stock</span>
        {product.compare_at_kes && <span className="sale-label">A good find</span>}
        <span className="product-art" aria-hidden="true"><span /></span>
        <span className="image-open"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="product-meta"><Link href={"/shops/" + product.tenant_slug}>{product.tenant_name}</Link><span>{product.category}</span></div>
      <Link href={"/products/" + product.slug} className="product-title">{product.name}</Link>
      <div className="product-card-bottom">
        <div><strong>{formatKes(product.price_kes)}</strong>{product.compare_at_kes && <del>{formatKes(product.compare_at_kes)}</del>}</div>
        <form action={addToCartAction}>
          <input type="hidden" name="product_id" value={product.id} />
          <input type="hidden" name="quantity" value="1" />
          <button className="add-button" aria-label={"Add " + product.name + " to bag"}><Plus size={17} /></button>
        </form>
      </div>
    </article>
  );
}
