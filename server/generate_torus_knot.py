import numpy as np

def generate_pq_torus(p, q):
    """
        Returns the matrix representation of a knot mosaic of a (p,q) torus knot.
        Requires p to be less than or equal to q.
    """
    if p < q:
        return generate_pq_torus(q, p)
    # Dimensions of mosaic should be p + q + 1
    if p > 0 and q > 0:
        n = p + q + 1
        res = [[0 for i in range(n)] for i in range(n)]

        # Place unknown tiles
        for i in range(1, p + 1):
            res[i][i] = -1
        
        for i in range(1, q + 1):
            res[n - 1 - i][i + 2] = -1

    return res