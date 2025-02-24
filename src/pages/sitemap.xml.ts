import { SITE_URL } from "utils/constants"
import { AirtableItemService } from "services/airtable"

const Sitemap = () => {}

export const getServerSideProps = async ({ res }: any) => {
    const service = new AirtableItemService()
    const items = await service.GetItems()
    const categories = await service.GetCategories()

    const baseUrl = SITE_URL
    const currentDate = new Date().toISOString()
    const launchDate = new Date(2021, 8).toISOString()

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>${baseUrl}</loc>
                <lastmod>${currentDate}</lastmod>
                <changefreq>daily</changefreq>
                <priority>1.0</priority>
            </url>
            <url>
                <loc>${baseUrl}submit</loc>
                <lastmod>${launchDate}</lastmod>
                <changefreq>yearly</changefreq>
            </url>
            ${categories.map((i) => {
                return `
                    <url>
                        <loc>${baseUrl}${i.id}</loc>
                        <lastmod>${currentDate}</lastmod>
                        <changefreq>daily</changefreq>
                        <priority>0.8</priority>
                    </url>`
            }).join("")}
            ${items.map((i) => {
                return `
                    <url>
                        <loc>${baseUrl}${i.category.id}/${i.id}</loc>
                        <lastmod>${new Date(i.created).toISOString()}</lastmod>
                        <changefreq>monthly</changefreq>
                        <priority>0.5</priority>
                    </url>`
            }).join("")}
        </urlset>`
    
    res.setHeader("Content-Type", "text/xml")
    res.write(sitemap)
    res.end()
    
    return {
        props: {},
    }
}

export default Sitemap